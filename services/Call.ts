import { request } from "./Request";

export async function login(email: string, password: string) {

  return await request(
    "post",
    "/api/v1/auth/login",
    {
      email,
      password,
    },

    10000
  );
}

export async function getMenus() {
  return await request(
    "post",
    "/api/v1/auth/user/menus",
    {},
    10000
  );
}

export async function getProfile() {
  return await request(
    "get",
    "/api/v1/profile",
    {},
    10000
  );
}