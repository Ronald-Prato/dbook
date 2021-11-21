export const handleAuthResponse = (response) => {
  if (Object.keys(response).includes("err")) {
    if (response.err === "Password too short!") {
      customAlert("password-too-short");
      return "error";
    }

    if (response.err === "Wrong user or password.") {
      customAlert("no-user");
      return "error";
    }

    if (response.err === "User is already being created or authenticated!") {
      customAlert("user-already-created-or-authenticated");
      return "error";
    }

    if (response.err === "User already created!") {
      customAlert("user-already-created");
      return "error";
    }
  }

  return "correct";
};

const customAlert = (option) => {
  const alertMap = {
    "no-user": () => alert("No se encontró el usuario"),
    "password-too-short": () => alert("La contraseña es muy corta"),
    "user-already-created-or-authenticated": () =>
      alert("El usuario ya fue registrado o autenticado"),
    "user-already-created": () => alert("El usuario ya fue creado"),
  };

  alertMap[option]();
};
