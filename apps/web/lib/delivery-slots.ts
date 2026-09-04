/**
 * Delivery Slot Generation Engine
 * 
 * Rules:
 *  - Minimum lead time: 30 minutes from order placement
 *    (e.g., ordering at 4:40 PM -> first slot starts at 5:10 PM)
 *  - Interval: 20 minutes (5:10 PM, 5:30 PM, 5:50 PM, 6:10 PM, ...)
 *  - Operating window: until restaurant closing hour (default 22:00 / 10:00 PM)
 */

export interface DeliverySlot {
  id: string;
  label: string;
  time: string;
  isTomorrow?: boolean;
}

export function generateDeliverySlots(closingHour: number = 22): DeliverySlot[] {
  const slots: DeliverySlot[] = [];
  const now = new Date();

  // Start exactly 30 minutes from now
  const start = new Date(now.getTime() + 30 * 60 * 1000);

  // Closing time today
  const closingTime = new Date(now);
  closingTime.setHours(closingHour, 0, 0, 0);

  const currentPointer = new Date(start);

  // If already past closing time (or within 20 mins of closing), generate tomorrow slots starting at 11:00 AM
  if (currentPointer >= closingTime) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0); // 11:00 AM

    const tomorrowClosing = new Date(tomorrow);
    tomorrowClosing.setHours(closingHour, 0, 0, 0);

    while (tomorrow <= tomorrowClosing) {
      const formatted = formatSlotTime(tomorrow);
      slots.push({
        id: `tomorrow-${formatted}`,
        label: `Tomorrow, ${formatted}`,
        time: formatted,
        isTomorrow: true,
      });
      tomorrow.setMinutes(tomorrow.getMinutes() + 20);
    }

    return slots;
  }

  // Generate today's slots in 20-minute increments
  while (currentPointer <= closingTime) {
    const formatted = formatSlotTime(currentPointer);
    slots.push({
      id: `today-${formatted}`,
      label: formatted,
      time: formatted,
      isTomorrow: false,
    });
    currentPointer.setMinutes(currentPointer.getMinutes() + 20);
  }

  return slots;
}

function formatSlotTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');

  return `${hoursStr}:${minutesStr} ${ampm}`;
}
