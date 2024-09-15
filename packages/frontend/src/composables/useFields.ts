import { toValue, type MaybeRef } from 'vue';
import { useFieldsService } from '@/services/useFieldsService';
import { FieldTypes, type Field } from '@tillywork/shared';

export const useFields = ({
  cardTypeId,
  listId,
  enabled,
}: {
  cardTypeId: MaybeRef<number>;
  listId?: MaybeRef<number>;
  enabled?: MaybeRef<boolean>;
}) => {
  const { useFieldsQuery } = useFieldsService();

  const cardTypeFieldsEnabled = computed(
    () => !!cardTypeId && (toValue(enabled) ?? true)
  );
  const listFieldsEnabled = computed(
    () => !!listId && (toValue(enabled) ?? true)
  );

  const { data: cardTypeFields, refetch } = useFieldsQuery({
    cardTypeId,
    enabled: cardTypeFieldsEnabled,
  });

  const { data: listFields } = useFieldsQuery({
    listId,
    enabled: listFieldsEnabled,
  });

  const fields = computed<Field[]>(() => {
    let arr: Field[] = [];

    if (cardTypeFields.value && cardTypeFieldsWithoutMainFields.value) {
      arr = [...arr, ...cardTypeFieldsWithoutMainFields.value];
    }

    if (listFields.value) {
      arr = [...arr, ...listFields.value];
    }

    return arr;
  });

  const titleField = computed(() =>
    cardTypeFields.value?.find((field) => field.isTitle)
  );

  const descriptionField = computed(() =>
    cardTypeFields.value?.find((field) => field.isDescription)
  );

  const assigneeField = computed(() =>
    cardTypeFields.value?.find((field) => field.isAssignee)
  );

  const cardTypeFieldsWithoutMainFields = computed(() =>
    cardTypeFields.value?.filter(
      (field) => !field.isTitle && !field.isDescription && !field.isPhoto
    )
  );

  const pinnedFields = computed(() =>
    fields.value?.filter((field) => field.isPinned)
  );

  /** Used in Board and List views, where we display the assignee field independantly of other pinned fields. */
  const pinnedFieldsWithoutAssignee = computed(() =>
    pinnedFields.value.filter((field) => !field.isAssignee)
  );

  const groupableFields = computed(() =>
    fields.value?.filter((field) =>
      [
        FieldTypes.DROPDOWN,
        FieldTypes.LABEL,
        FieldTypes.DATE,
        FieldTypes.USER,
      ].includes(field.type)
    )
  );

  const tableFields = computed(() =>
    fields.value.filter((field) =>
      [
        FieldTypes.DROPDOWN,
        FieldTypes.LABEL,
        FieldTypes.DATE,
        FieldTypes.USER,
      ].includes(field.type)
    )
  );

  function sortFieldsByViewColumns(fields: Field[], columns: string[]) {
    return fields.sort((a, b) => {
      const indexA = columns.indexOf(a.id.toString());
      const indexB = columns.indexOf(b.id.toString());

      // If both IDs are found in columns
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one ID is found, prioritize the found one
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither ID is found, maintain their original order
      return 0;
    });
  }

  return {
    fields,
    listFields,
    cardTypeFields,
    titleField,
    descriptionField,
    assigneeField,
    cardTypeFieldsWithoutMainFields,
    pinnedFields,
    pinnedFieldsWithoutAssignee,
    groupableFields,
    tableFields,
    refetch,
    sortFieldsByViewColumns,
  };
};
