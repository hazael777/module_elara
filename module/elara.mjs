import { initializeCompendiumBlocker, unregisterBlockedPacks } from "./compendium-blocker.mjs";
import { initializePrerequisiteChecker } from "./prerequisite-checker.mjs";
import { initializeRestRecharge } from "./rest-recharge.mjs";

// Register pack unregistration as early as possible, before anything else runs.
// game.packs is populated during "setup", which fires after "init".
Hooks.on("setup", unregisterBlockedPacks);

// Initialize compendium item blocker (registers UI hooks)
initializeCompendiumBlocker();

// Initialize feat prerequisite checker
initializePrerequisiteChecker();

// Initialize rest recharge system
initializeRestRecharge();
