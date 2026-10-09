---
layout: base.html
---

<header class="site-header">
<h1>idėjos <a href="https://dago.lt" class="opacity-20 text-nowrap hover:opacity-100 no-underline">// dago</a></h1>

<blockquote class="inspiration">
<p><strong>Įkvėpta:</strong> <a href="https://aboutideasnow.com">aboutideasnow.com</a></p>
</blockquote>

{% assign latest = idejos.latest %}
{% if latest %}
<div class="metadata"><em>atnaujinta: <time datetime="{{ latest.date }}">{{ latest.date | dateYMD }}</time></em><br>
<span class="idea-count-wrapper"><em>idėjų: {{ latest.count }} ({{ latest.diff }})</em><button type="button" class="changelog-toggle" popovertarget="changelog-popover" aria-label="Rodyti pakeitimų istoriją" title="Pakeitimų istorija">⏱</button></span></div>
<div id="changelog-popover" class="changelog-dropdown" popover><ul>{% for update in idejos.updates reversed %}<li><time datetime="{{ update.date }}" class="changelog-date">{{ update.date | dateYMD }}</time><span class="changelog-count" aria-label="Idėjų kiekis">{{ update.count }}</span><span class="changelog-diff" aria-label="Pokytis">{{ update.diff }}</span></li>{% endfor %}</ul></div>
{% endif %}

</header>

<section class="ideas-section">

{% idejosBody idejos %}

</section>
