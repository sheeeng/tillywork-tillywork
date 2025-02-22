<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import validationUtils from '@/utils/validation';
import { useSnackbarStore } from '@/stores/snackbar';
import BaseColorPicker from '../inputs/BaseColorPicker.vue';

import { DIALOGS, UpsertDialogMode } from './types';
import { useDialogStore } from '@/stores/dialog';

import { useQueryClient } from '@tanstack/vue-query';
import { useListStagesService } from '@/services/useListStagesService';
import type { ListStage } from '@tillywork/shared';

const { rules } = validationUtils;
const { showSnackbar } = useSnackbarStore();

// Dialog
const dialog = useDialogStore();
const currentDialogIndex = computed(() =>
  dialog.getDialogIndex(DIALOGS.UPSERT_LIST_STAGE)
);
const currentDialog = computed(() => dialog.dialogs[currentDialogIndex.value]);
const listStage = computed<ListStage>(() => currentDialog.value.data.listStage);

// Core
const queryClient = useQueryClient();
const listStagesService = useListStagesService();
const { mutateAsync: createListStage, isPending: isCreating } =
  listStagesService.useCreateListStageMutation();
const { mutateAsync: updateListStage, isPending: isUpdating } =
  listStagesService.useUpdateListStageMutation();

const listStageForm = ref<VForm>();
const listStageDto = ref<ListStage>({
  listId: listStage.value.listId,
  id: listStage.value.id,
  name: listStage.value.name,
  color: listStage.value.color,
  order: listStage.value.order ?? 0,
  isCompleted: listStage.value.isCompleted ?? false,
});

async function handleSubmitForm() {
  const isValid = await listStageForm.value?.validate();
  if (!isValid?.valid) return;

  try {
    const payload = {
      listId: listStageDto.value.listId,
      listStage: listStageDto.value,
    };

    switch (currentDialog.value.data.mode) {
      case UpsertDialogMode.CREATE:
        await createListStage(payload);
        break;
      case UpsertDialogMode.UPDATE:
        await updateListStage(payload);
        break;

      default:
        break;
    }

    dialog.closeDialog(currentDialogIndex.value);
    queryClient.invalidateQueries({ queryKey: ['listGroups'] });
  } catch (err) {
    showSnackbar({
      message: 'Something went wrong, please try again.',
      color: 'error',
      timeout: 5000,
    });
  }
}
</script>

<template>
  <v-card
    color="dialog"
    elevation="12"
    border="thin"
    :loading="isCreating || isUpdating"
  >
    <div class="d-flex align-center ps-0 pa-4">
      <v-card-subtitle>
        <span class="text-capitalize">{{ currentDialog?.data.mode }}</span>
        list stage
      </v-card-subtitle>
      <v-spacer />
      <base-icon-btn
        icon="mdi-close"
        color="default"
        @click="dialog.closeDialog(currentDialogIndex)"
      />
    </div>
    <v-form
      ref="listStageForm"
      @submit.prevent="handleSubmitForm"
      validate-on="submit"
    >
      <v-card-text>
        <v-text-field
          v-model="listStageDto.name"
          :rules="[rules.required]"
          label="Name*"
          autofocus
        />
        <base-color-picker
          v-model="listStageDto.color"
          label="Color*"
          :rules="[rules.required]"
        />
        <v-checkbox
          v-model="listStageDto.isCompleted"
          color="primary"
          label="Mark card as completed"
          hide-details
          density="compact"
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-start align-center py-0 px-4">
        <v-spacer />

        <v-btn
          density="comfortable"
          variant="flat"
          class="text-caption px-4 ms-4"
          type="submit"
          :loading="isCreating || isUpdating"
        >
          {{
            currentDialog?.data.mode === UpsertDialogMode.CREATE
              ? 'Create'
              : 'Save'
          }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
