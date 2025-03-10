<script setup lang="ts">
import type { List } from '@tillywork/shared';
import NavigationWorkspaceListItemMenu from './NavigationWorkspaceListItemMenu.vue';

const route = useRoute('/pm/list/[listId]/');
const router = useRouter();

defineProps<{
  list: List;
}>();

const freezeListHoverId = ref<number | null>();

function handleListClick(list: List) {
  router.push(`/pm/list/${list.id}`);
}

function setHoverFreeze(list: List) {
  freezeListHoverId.value = list.id;
}

function clearHoverFreeze() {
  freezeListHoverId.value = null;
}
</script>

<template>
  <v-hover v-slot="{ isHovering: isListHovering, props: listHoverProps }">
    <v-list-item
      rounded="md"
      slim
      v-bind="listHoverProps"
      @click="handleListClick(list)"
      :active="+route.params.listId === list.id"
    >
      <template v-slot:prepend>
        <v-icon :icon="list.icon" :color="list.iconColor" />
      </template>
      <v-list-item-title class="user-select-none">
        {{ list.name }}
      </v-list-item-title>
      <template
        v-slot:append
        v-if="isListHovering || freezeListHoverId === list.id"
      >
        <navigation-workspace-list-item-menu
          @hover:freeze="setHoverFreeze(list)"
          @hover:unfreeze="clearHoverFreeze"
          :list
        />
      </template>
    </v-list-item>
  </v-hover>
</template>
