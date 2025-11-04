function removeFeat(actor, itemName) {
  // Wait a tick for the item to be created, then remove it
  setTimeout(async () => {
    console.log("Trying to delete feat");
    const item = actor.items.find(i => i.name === itemName);
    if (item) {
      await actor.deleteEmbeddedDocuments("Item", [item.id]);
    }
  }, 500);
}

Hooks.on("dropActorSheetData", async (actor, sheet, data) => {


  // Feats object containing all feat data
  const feats = {
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

  // Potential prerequisite constants
  const auraControlSkill = actor.system?.skills?.["aura-control"];
  const hasAuraControlFeat = actor.items.some(i => i.uuid === feats.auraControl.uuid);
  const hasAdvancedAuraControlFeat = actor.items.some(i => i.uuid === feats.advancedAuraControl.uuid);
  const hasAuraManeuverFeat = actor.items.some(i => i.uuid === feats.auraManeuver.uuid);
  const hasAuraSuppressionFeat = actor.items.some(i => i.uuid === feats.auraSuppression.uuid);
  const hasAuraAttackFeat = actor.items.some(i => i.uuid === feats.auraAttack.uuid);
  const hasAuraSenseFeat = actor.items.some(i => i.uuid === feats.auraSense.uuid);
  const hasAuraAnalysisFeat = actor.items.some(i => i.uuid === feats.auraAnalysis.uuid);

  //Aura Control prerequisite check
  if (data?.uuid === feats.auraControl.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 1) {
      ui.notifications.warn(`${actor.name} must be at least trained in Aura Control to add this feat!`);
      removeFeat(actor, feats.auraControl.name);
    }
  }

  //Advanced Aura Control prerequisite check
  if (data?.uuid === feats.advancedAuraControl.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 1 || !hasAuraControlFeat) {
      ui.notifications.warn(`${actor.name} must be at least trained in Aura Control and have the Aura Control Feat to add this feat!`);
      removeFeat(actor, feats.advancedAuraControl.name);
    }
  }

  // Aura Maneuver prerequisite check
  if (data?.uuid === feats.auraManeuver.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 2 || !hasAdvancedAuraControlFeat) {
      ui.notifications.warn(`${actor.name} must be at least expert in Aura Control and have the Advanced Aura Control Feat to add this feat!`);
      removeFeat(actor, feats.auraManeuver.name);
    }
  }

  // Aura Flight prerequisite check
  if (data?.uuid === feats.auraFlight.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 3 || !hasAuraManeuverFeat) {
      ui.notifications.warn(`${actor.name} must be at least master in Aura Control and have the Aura Maneuver Feat to add this feat!`);
      removeFeat(actor, feats.auraFlight.name);
    }
  }

  // Aura Suppression prerequisite check
  if (data?.uuid === feats.auraSuppression.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 1 || !hasAuraControlFeat) {
      ui.notifications.warn(`${actor.name} must be at least trained in Aura Control and have the Aura Control Feat to add this feat!`);
      removeFeat(actor, feats.auraSuppression.name);
    }
  }

  // Aura Attack prerequisite check
  if (data?.uuid === feats.auraAttack.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 2 || !hasAuraSuppressionFeat) {
      ui.notifications.warn(`${actor.name} must be at least expert in Aura Control and have the Aura Suppression Feat to add this feat!`);
      removeFeat(actor, feats.auraAttack.name);
    }
  }

  // Aura Constriction prerequisite check
  if (data?.uuid === feats.auraConstriction.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 3 || !hasAuraAttackFeat) {
      ui.notifications.warn(`${actor.name} must be at least master in Aura Control and have the Aura Attack Feat to add this feat!`);
      removeFeat(actor, feats.auraConstriction.name);
    }
  }

  // Aura Sense prerequisite check
  if (data?.uuid === feats.auraSense.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 1 || !hasAuraControlFeat) {
      ui.notifications.warn(`${actor.name} must be at least trained in Aura Control and have the Aura Control Feat to add this feat!`);
      removeFeat(actor, feats.auraSense.name);
    }
  }

  // Aura Analysis prerequisite check
  if (data?.uuid === feats.auraAnalysis.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 2 || !hasAuraSenseFeat) {
      ui.notifications.warn(`${actor.name} must be at least expert in Aura Control and have the Aura Sense Feat to add this feat!`);
      removeFeat(actor, feats.auraAnalysis.name);
    }
  }

  // Subtle Aura prerequisite check
  if (data?.uuid === feats.subtleAura.uuid) {
    if (!auraControlSkill || auraControlSkill.rank < 3 || !hasAuraAnalysisFeat) {
      ui.notifications.warn(`${actor.name} must be at least master in Aura Control and have the Aura Analysis Feat to add this feat!`);
      removeFeat(actor, feats.subtleAura.name);
    }
  }

});

