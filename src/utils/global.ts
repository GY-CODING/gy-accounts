export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Lee el archivo como una URL Base64
    reader.onload = () => resolve(reader.result as string); // Devuelve la cadena Base64
    reader.onerror = (error) =>
      reject(new Error('Failed to read file', { cause: error }));
  });
};
