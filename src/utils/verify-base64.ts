const VerifyBase64 = (base64: string): boolean => {
  const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|webp|svg\+xml);base64,/;

  if (!base64Pattern.test(base64)) {
    return false;
  }

  const base64Data = base64.split(",")[1];

  const isBase64Valid = /^[A-Za-z0-9+/=]+$/.test(base64Data);

  return isBase64Valid;
};


export default VerifyBase64