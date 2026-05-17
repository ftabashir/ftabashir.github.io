---
layout: post
title:  "Timeline of Iran's Political History"
date:   2026-05-17 12:00:00
categories: politics
---

<link title="timeline-theme" rel="stylesheet" href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">
<script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"></script>

<div class="timeline-controls" style="margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
  <strong>Sources:</strong>
  <label style="margin-right: 15px;">
    <input type="checkbox" class="timeline-source-toggle" value="/api/iran_timeline.json" checked> Iran History
  </label>
  
  <strong>Filters:</strong>
  <select id="timeline-tier-filter" style="margin-right: 15px;">
    <option value="3">All Details (Tiers 1-3)</option>
    <option value="2">Major Events (Tiers 1-2)</option>
    <option value="1">Milestones Only (Tier 1)</option>
  </select>
</div>

<div id="timeline-embed" style="width: 100%; height: 600px; background: #eee;"></div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const containerId = 'timeline-embed';
  const sourceCheckboxes = document.querySelectorAll('.timeline-source-toggle');
  const tierFilter = document.getElementById('timeline-tier-filter');
  let timelineInstance = null;

  function renderTimeline() {
    const selectedUrls = Array.from(sourceCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const maxTier = parseInt(tierFilter.value, 10);

    if (selectedUrls.length === 0) {
      document.getElementById(containerId).innerHTML = '<div style="padding: 20px; text-align: center;">Please select at least one timeline source.</div>';
      if (timelineInstance) { timelineInstance = null; }
      return;
    }

    // Fetch all selected JSON files
    Promise.all(selectedUrls.map(url => fetch(url).then(res => {
      if (!res.ok) throw new Error("Network response was not ok: " + res.statusText);
      return res.json();
    })))
      .then(datasets => {
        let mergedEvents = [];
        datasets.forEach(data => {
          if (data && data.events) {
            mergedEvents = mergedEvents.concat(data.events);
          }
        });

        // Filter based on custom fields (tier)
        const filteredEvents = mergedEvents.filter(event => {
          const tier = event.tier || 1;
          return tier <= maxTier;
        });

        const finalData = { events: filteredEvents };

        // Re-initialize TimelineJS
        document.getElementById(containerId).innerHTML = '';
        timelineInstance = new TL.Timeline(containerId, finalData, {
          debug: true
        });
      })
      .catch(err => {
        console.error("Error loading timeline data", err);
        document.getElementById(containerId).innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Failed to load timeline data.</div>';
      });
  }

  // Attach event listeners
  sourceCheckboxes.forEach(cb => cb.addEventListener('change', renderTimeline));
  tierFilter.addEventListener('change', renderTimeline);

  // Initial render
  renderTimeline();
});
</script>
