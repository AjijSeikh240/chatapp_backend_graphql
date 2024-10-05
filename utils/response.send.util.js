export function sendResponse(
  code = 200,
  status = true,
  msg = "ok",
  data = null
) {
  const response = {
    code,
    status,
    msg,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return response;
}

export function sendValidationResponse(code = 200, status = true, msg = "") {
  if (msg && Array.isArray(msg) && msg.length > 0) {
    msg = msg[0].message
      .split('"')
      .filter((ele) => ele != '"')
      .join("");
  } else {
    if (msg.trim().length > 0 || !msg) {
      msg = "Something... went wrong!";
    }
  }
  const response = {
    code,
    status,
    msg,
  };

  return response;
}

export function sendUnauthorizeResponse(msg) {
  const response = {
    code: 403,
    status: false,
    msg,
    data: null,
  };
  console.log("response", response);
  return response;
}
