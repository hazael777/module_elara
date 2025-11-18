import { initializeCompendiumBlocker } from "./compendium-blocker.mjs";
import { initializePrerequisiteChecker } from "./prerequisite-checker.mjs";
import { initializeRestRecharge } from "./rest-recharge.mjs";

// Initialize compendium item blocker
initializeCompendiumBlocker();

// Initialize feat prerequisite checker
initializePrerequisiteChecker();

// Initialize rest recharge system
initializeRestRecharge();
