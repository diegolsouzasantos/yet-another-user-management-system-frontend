export function hasPermission(actor, permission) {
  return Boolean(actor) && (actor.grantsAll || actor.permissions.includes(permission));
}
