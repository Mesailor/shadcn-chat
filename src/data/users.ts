export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  username: string;
}

export const CURRENT_USER: User = {
  id: "johndoe-user-id",
  name: "John Doe",
  avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
  username: "@johndoe",
};

export const OTHER_USER: User = {
  id: "annsmith-user-id",
  name: "Ann Smith",
  avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
  username: "@annsmith",
};
