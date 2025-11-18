// Feats object containing all feat data
const FEATS = {
  auraControl: {
    uuid: "Compendium.elara.feats.Item.HNUcleiLzOlNijpU",
    name: "Aura Control"
  },
  advancedAuraControl: {
    uuid: "Compendium.elara.feats.Item.gIILpCeZgvZ9YgEA",
    name: "Advanced Aura Control"
  },
  auraManeuver: {
    uuid: "Compendium.elara.feats.Item.8pY8diSP7HY2IFvB",
    name: "Aura Maneuver"
  },
  auraFlight: {
    uuid: "Compendium.elara.feats.Item.TYgZgjp7XuiSPxxb",
    name: "Aura Flight"
  },
  auraSuppression: {
    uuid: "Compendium.elara.feats.Item.jHi3UiizWaQcW27M",
    name: "Aura Suppression"
  },
  auraAttack: {
    uuid: "Compendium.elara.feats.Item.Z4qBv8wp9Z0qKrXL",
    name: "Aura Attack"
  },
  auraConstriction: {
    uuid: "Compendium.elara.feats.Item.Zl1f6ITRBeKLM7h5",
    name: "Aura Constriction"
  },
  auraSense: {
    uuid: "Compendium.elara.feats.Item.uCKhxozTbfGH3kBt",
    name: "Aura Sense"
  },
  auraAnalysis: {
    uuid: "Compendium.elara.feats.Item.SFCgwb5v6thKSb5z",
    name: "Aura Analysis"
  },
  subtleAura: {
    uuid: "Compendium.elara.feats.Item.yABXmNFcnf3O1X9v",
    name: "Subtle Aura"
  }
};

/**
 * Remove a feat from an actor after a delay
 */
function removeFeat(actor, itemName) {
  setTimeout(async () => {
    const item = actor.items.find(i => i.name === itemName);
    if (item) {
      await actor.deleteEmbeddedDocuments("Item", [item.id]);
    }
  }, 500);
}

/**
 * Initialize feat prerequisite checking
 */
export function initializePrerequisiteChecker() {
  Hooks.on("dropActorSheetData", async (actor, sheet, data) => {
    // Get actor's aura control skill
    const auraControlSkill = actor.system?.skills?.["aura-control"];
    
    // Check which feats the actor has
    const hasAuraControlFeat = actor.items.some(i => i.name === FEATS.auraControl.name);
    const hasAdvancedAuraControlFeat = actor.items.some(i => i.name === FEATS.advancedAuraControl.name);
    const hasAuraManeuverFeat = actor.items.some(i => i.name === FEATS.auraManeuver.name);
    const hasAuraSuppressionFeat = actor.items.some(i => i.name === FEATS.auraSuppression.name);
    const hasAuraAttackFeat = actor.items.some(i => i.name === FEATS.auraAttack.name);
    const hasAuraSenseFeat = actor.items.some(i => i.name === FEATS.auraSense.name);
    const hasAuraAnalysisFeat = actor.items.some(i => i.name === FEATS.auraAnalysis.name);

    // Aura Control prerequisite check
    if (data?.uuid === FEATS.auraControl.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 1) {
        ui.notifications.warn(`${actor.name} must be at least trained in Aura Control to add this feat!`);
        removeFeat(actor, FEATS.auraControl.name);
      }
    }

    // Advanced Aura Control prerequisite check
    if (data?.uuid === FEATS.advancedAuraControl.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 1 || !hasAuraControlFeat) {
        ui.notifications.warn(`${actor.name} must be at least trained in Aura Control and have the Aura Control Feat to add this feat!`);
        removeFeat(actor, FEATS.advancedAuraControl.name);
      }
    }

    // Aura Maneuver prerequisite check
    if (data?.uuid === FEATS.auraManeuver.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 2 || !hasAdvancedAuraControlFeat) {
        ui.notifications.warn(`${actor.name} must be at least expert in Aura Control and have the Advanced Aura Control Feat to add this feat!`);
        removeFeat(actor, FEATS.auraManeuver.name);
      }
    }

    // Aura Flight prerequisite check
    if (data?.uuid === FEATS.auraFlight.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 3 || !hasAuraManeuverFeat) {
        ui.notifications.warn(`${actor.name} must be at least master in Aura Control and have the Aura Maneuver Feat to add this feat!`);
        removeFeat(actor, FEATS.auraFlight.name);
      }
    }

    // Aura Suppression prerequisite check
    if (data?.uuid === FEATS.auraSuppression.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 1 || !hasAuraControlFeat) {
        ui.notifications.warn(`${actor.name} must be at least trained in Aura Control and have the Aura Control Feat to add this feat!`);
        removeFeat(actor, FEATS.auraSuppression.name);
      }
    }

    // Aura Attack prerequisite check
    if (data?.uuid === FEATS.auraAttack.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 2 || !hasAuraSuppressionFeat) {
        ui.notifications.warn(`${actor.name} must be at least expert in Aura Control and have the Aura Suppression Feat to add this feat!`);
        removeFeat(actor, FEATS.auraAttack.name);
      }
    }

    // Aura Constriction prerequisite check
    if (data?.uuid === FEATS.auraConstriction.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 3 || !hasAuraAttackFeat) {
        ui.notifications.warn(`${actor.name} must be at least master in Aura Control and have the Aura Attack Feat to add this feat!`);
        removeFeat(actor, FEATS.auraConstriction.name);
      }
    }

    // Aura Sense prerequisite check
    if (data?.uuid === FEATS.auraSense.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 1 || !hasAuraControlFeat) {
        ui.notifications.warn(`${actor.name} must be at least trained in Aura Control and have the Aura Control Feat to add this feat!`);
        removeFeat(actor, FEATS.auraSense.name);
      }
    }

    // Aura Analysis prerequisite check
    if (data?.uuid === FEATS.auraAnalysis.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 2 || !hasAuraSenseFeat) {
        ui.notifications.warn(`${actor.name} must be at least expert in Aura Control and have the Aura Sense Feat to add this feat!`);
        removeFeat(actor, FEATS.auraAnalysis.name);
      }
    }

    // Subtle Aura prerequisite check
    if (data?.uuid === FEATS.subtleAura.uuid) {
      if (!auraControlSkill || auraControlSkill.rank < 3 || !hasAuraAnalysisFeat) {
        ui.notifications.warn(`${actor.name} must be at least master in Aura Control and have the Aura Analysis Feat to add this feat!`);
        removeFeat(actor, FEATS.subtleAura.name);
      }
    }
  });
}
