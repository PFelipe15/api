const VerifyBase64 = (base64: string): boolean => {
  const base64Data = base64.split(",").pop();

  if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
    return false;
  }

  if (base64Data.length % 4 !== 0) {
    return false;
  }
  try {
    Buffer.from(base64Data, "base64");
    return true;
  } catch (error) {
    return false;
  }
};

export default VerifyBase64;
