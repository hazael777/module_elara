// Blocked items from compendium searches
// Format: { uuid: "item name" }
const BLOCKED_ITEMS = {
  "Compendium.pf2e.spells-srd.Item.kqhPt9344UkcGVYO": "Resurrect",
  "Compendium.pf2e.spells-srd.Item.gIVaSCrLhhBzGHQY": "Reincarnate",
  "Compendium.pf2e.spells-srd.Item.HpIJTVqgXorH9X0L": "Revival",
  "Compendium.pf2e.spells-srd.Item.IkGYwHRLhkuoGReG": "Raise Dead",

  "Compendium.pf2e.spells-srd.Item.69L70wKfGDY66Mk9": "Teleport",
  "Compendium.pf2e.spells-srd.Item.F1qxaqsEItmBura2": "Nature's Pathway",
  "Compendium.pf2e.spells-srd.Item.5bTt2CvYHPvaR7QQ": "Interplanar Teleport",
  "Compendium.pf2e.spells-srd.Item.U13bC0tNgrlHoeTK": "Gate",
  "Compendium.pf2e.spells-srd.Item.5ZW1w9f4gWlSIuWA": "Teleportation Circle",
  "Compendium.pf2e.spells-srd.Item.oKC36WjFD1jgqUN5": "Forest of Gates",
  "Compendium.pf2e.feats-srd.Item.wYerMk6F1RZb0Fwt": "Battle Medicine",
  "Compendium.pf2e.feats-srd.Item.xOMwuKCf02aFzyp3": "Paragon Battle Medicine"
};

// Entire packs to unregister from Foundry at startup.
const BLOCKED_PACKS = new Set([
  "pf2e.deities"
]);

// Cache of blocked item names for faster filtering
const BLOCKED_ITEM_NAMES = new Set(Object.values(BLOCKED_ITEMS));

/**
 * Unregister blocked packs from game.packs.
 * Exported so elara.mjs can register it on the "setup" hook directly,
 * ensuring it runs as early as possible before the UI is built.
 */
export function unregisterBlockedPacks() {
  for (const packId of BLOCKED_PACKS) {
    if (game.packs?.get(packId)) {
      game.packs.delete(packId);
      console.log(`Elara | Unregistered compendium pack: ${packId}`);
    }
  }
}

/**
 * Initialize compendium UI blocking hooks
 */
export async function initializeCompendiumBlocker() {
  const blockedUUIDs = Object.keys(BLOCKED_ITEMS);

  // Fallback: hide blocked packs from the sidebar in case of re-renders
  Hooks.on("renderCompendiumDirectory", (app, html) => {
    const $html = html instanceof jQuery ? html : $(html);
    $html.find(".compendium-pack[data-pack]").each(function() {
      if (BLOCKED_PACKS.has(this.dataset.pack)) {
        this.style.display = "none";
      }
    });
  });

  // Hook to filter compendium content (regular compendium view)
  Hooks.on("renderCompendium", async (app, html, data) => {
    const $html = html instanceof jQuery ? html : $(html);
    
    $html.find(".directory-item").each(function() {
      const entryId = this.dataset.entryId;
      const doc = app.collection.get(entryId);
      
      if (doc && blockedUUIDs.includes(doc.uuid)) {
        this.style.display = "none";
      }
    });
  });

  // Hook to filter PF2E Compendium Browser
  Hooks.on("renderCompendiumBrowser", (app, html) => {
    const $html = html instanceof jQuery ? html : $(html);
    
    filterBrowserResults($html);
    
    const targetElement = $html[0] || html;
    const observer = new MutationObserver(() => {
      filterBrowserResults($html);
    });
    
    observer.observe(targetElement, { childList: true, subtree: true });
  });

  // Hook into the compendium browser's data preparation
  Hooks.on("pf2e.compendiumBrowser.filterIndexData", (browser, type, indexData) => {
    if (!indexData) return indexData;
    
    return indexData.filter(entry => {
      const uuid = entry.uuid || `Compendium.${entry.pack}.Item.${entry._id}`;
      const pack = entry.pack || uuid.split(".")[1];
      return !blockedUUIDs.includes(uuid) && !BLOCKED_PACKS.has(pack);
    });
  });

  // Watch for global search results
  Hooks.once("ready", () => {
    const bodyObserver = new MutationObserver(() => {
      document.querySelectorAll('li.match[data-uuid]').forEach(item => {
        const uuid = item.dataset.uuid;
        const pack = uuid.split(".").slice(0, 2).join(".");
        if (blockedUUIDs.includes(uuid) || BLOCKED_PACKS.has(pack)) {
          item.style.display = "none";
        }
      });
    });
    
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  });
}

/**
 * Filter browser results to hide blocked items
 */
function filterBrowserResults(html) {
  html.find("li button.result-link").each(function() {
    const itemName = this.textContent.trim();
    if (BLOCKED_ITEM_NAMES.has(itemName)) {
      this.closest("li").style.display = "none";
    }
  });
}
