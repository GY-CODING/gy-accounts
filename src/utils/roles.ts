// Los roles visibles se configuran SOLO con la variable de entorno PUBLIC_ROLES
// (lista separada por comas). Para cambiarlos no hay que tocar código.
// Si la variable no está definida o está vacía, se muestran todos los roles del usuario.
const VISIBLE_ROLES: string[] = (process.env.PUBLIC_ROLES ?? '')
  .split(',')
  .map((role) => role.trim().toUpperCase())
  .filter(Boolean);

// Filtra solo para mostrar: los roles reales del usuario no se modifican.
export const filterVisibleRoles = (roles?: string[] | null): string[] => {
  const userRoles = roles ?? [];
  if (VISIBLE_ROLES.length === 0) return userRoles;
  return userRoles.filter((role) => VISIBLE_ROLES.includes(role.toUpperCase()));
};
