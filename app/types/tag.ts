export type Tag = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type TagIdInput = Pick<Tag, 'id'>;
export type CreateTagInput = Pick<Tag, 'name'>;
export type UpdateTagInput = Pick<Tag, 'id' | 'name'>;
export type DeleteTagInput = Pick<Tag, 'id'>;
