/**
 * Initialize item recharge on rest
 */
export function initializeRestRecharge() {
  // Hook that fires when an actor completes a rest
  Hooks.on("pf2e.restForTheNight", async (actor) => {
    console.log("Elara: Rest for the night triggered for", actor.name);
    
    // Find all items with the elara.rechargeOnRest flag
    const itemsToRecharge = actor.items.filter(item => {
      return item.getFlag("elara", "rechargeOnRest") === true;
    });
    
    if (itemsToRecharge.length === 0) {
      console.log("Elara: No items to recharge");
      return;
    }
    
    console.log(`Elara: Found ${itemsToRecharge.length} items to recharge`);
    
    // Recharge each item
    for (const item of itemsToRecharge) {
      // Check for both "uses" and "charges" properties
      const maxUses = item.system.uses?.max;
      const maxCharges = item.system.charges?.max;
      
      if (maxUses !== undefined) {
        await item.update({
          "system.uses.value": maxUses
        });
        
        console.log(`Elara: Recharged ${item.name} to ${maxUses} uses`);
        
        // Optional: Show a notification to the player
        if (game.user.character?.id === actor.id) {
          ui.notifications.info(`${item.name} has been recharged to ${maxUses} uses.`);
        }
      } else if (maxCharges !== undefined) {
        await item.update({
          "system.charges.value": maxCharges
        });
        
        console.log(`Elara: Recharged ${item.name} to ${maxCharges} charges`);
        
        // Optional: Show a notification to the player
        if (game.user.character?.id === actor.id) {
          ui.notifications.info(`${item.name} has been recharged to ${maxCharges} charges.`);
        }
      }
    }
  });
}
