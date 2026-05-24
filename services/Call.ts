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

export async function getAccess(authorization: string) {
  return await request(
    "post",
    "/api/v1/auth/access",
    {
      authorization: authorization
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

export async function jurnalList(page: string) {
  return await request(
    "get",
    `/api/v1/jurnal/list/${page}`,
    {},
    10000
  );
}

export async function listAllKelas() {
  return await request(
    "get",
    `/api/v1/class-room/class`,
    {},
    10000
  );
}