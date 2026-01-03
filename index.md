---
layout: base.html
---

# /ideas

> **Įkvėpta:** [aboutideasnow.com](https://aboutideasnow.com)

{% assign latest = idejos.latest %}
{% if latest %}
*atnaujinta: <time datetime="{{ latest.date }}">{{ latest.date | dateYMD }}</time>*<br>
<span class="idea-count-wrapper"><em>idėjų: {{ latest.count }} ({{ latest.diff }})</em><button class="changelog-toggle" popovertarget="changelog-popover" aria-label="Rodyti pakeitimų istoriją" title="Pakeitimų istorija">⏱</button><div id="changelog-popover" class="changelog-dropdown" popover><ul>{% for update in idejos.updates reversed %}<li><time datetime="{{ update.date }}" class="changelog-date">{{ update.date | dateYMD }}</time><span class="changelog-count" aria-label="Idėjų kiekis">{{ update.count }}</span><span class="changelog-diff" aria-label="Pokytis">{{ update.diff }}</span></li>{% endfor %}</ul></div></span>
{% endif %}

{% idejosBody idejos %}