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

export async function detailJurnal(id: string) {
  return await request(
    "get",
    `/api/v1/jurnal/detail/${id}`,
    {},
    10000
  );
}

export async function newjurnal(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/create-new`,
    {
      ...body
    },
    10000
  );
}

export async function updateJurnal(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/update`,
    body,
    10000
  );
}

export async function inisiasiPenilaian(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/inisiasi-penilaian`,
    body,
    10000
  );
}

export async function submitItemPenilaian(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/submit-item-penilaian`,
    body,
    10000
  );
}

export async function editItemPenilaian(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/update-item-penilaian`,
    body,
    10000
  );
}

export async function getItemPenilaian(id: any) {
  return await request(
    "get",
    `/api/v1/jurnal/item/nilai/${id}`,
    {},
    10000
  );
}

export async function updateAbsensi(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/update-absensi`,
    {
      id: body.id,
      absensi: body.absensi
    },
    10000
  );
}

export async function submitNilai(body: any) {
  return await request(
    "post",
    `/api/v1/jurnal/update-penilaian`,
    body,
    300000
  );
}

export async function updateIpAndIa(body: any) {
  return await request(
    "post",
    `/api/v1/profile/ds1/update-personal`,
    body,
    300000
  );
}

export async function updateEmail(body: any) {
  return await request(
    "post",
    `/api/v1/profile/update-email`,
    body,
    300000
  );
}

export async function updatePassword(body: any) {
  return await request(
    "post",
    `/api/v1/profile/change/password`,
    body,
    300000
  );
}