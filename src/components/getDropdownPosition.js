export function getLocalDropdownPosition(clickX, clickY, menuWidth, menuHeight) {
  const container = document.querySelector(".publishcontainer");
  if (!container) {
    return { x: clickX, y: clickY };
  }

  const rect = container.getBoundingClientRect();

  // Make click position RELATIVE to container
  let x = clickX - rect.left;
  let y = clickY - rect.top;

  // Small offset so menu opens right/below click
  x += 10;
  y += 10;

  const maxX = rect.width - menuWidth - 10;
  const maxY = rect.height - menuHeight - 10;

  // Open upward if bottom space is less
  const spaceBelow = rect.height - y;
  if (spaceBelow < menuHeight + 20) {
    y = y - menuHeight - 10;
  }

  // Clamp within container
  x = Math.max(10, Math.min(x, maxX));
  y = Math.max(10, Math.min(y, maxY));

  return { x, y };
}