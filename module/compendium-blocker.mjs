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
  "Compendium.pf2e.feats-srd.Item.xOMwuKCf02aFzyp3" : "Paragon Battle Medicine"
};

// Cache of blocked item names for faster filtering
const BLOCKED_ITEM_NAMES = new Set(Object.values(BLOCKED_ITEMS));

/**
 * Initialize compendium item blocking
 */
export async function initializeCompendiumBlocker() {
  const blockedUUIDs = Object.keys(BLOCKED_ITEMS);

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
    
    // Initial filter
    filterBrowserResults($html);
    
    // Use MutationObserver to catch dynamically loaded search results
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
      return !blockedUUIDs.includes(uuid);
    });
  });

  // Hook into ready to watch for global search results
  Hooks.once("ready", () => {
    // Watch the entire document body for search results
    const bodyObserver = new MutationObserver(() => {
      document.querySelectorAll('li.match[data-uuid]').forEach(item => {
        const uuid = item.dataset.uuid;
        if (blockedUUIDs.includes(uuid)) {
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
  // Filter by button text (item name)
  html.find("li button.result-link").each(function() {
    const itemName = this.textContent.trim();
    if (BLOCKED_ITEM_NAMES.has(itemName)) {
      this.closest("li").style.display = "none";
    }
  });
}
