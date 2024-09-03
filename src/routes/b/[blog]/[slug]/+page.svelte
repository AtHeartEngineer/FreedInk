<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>{data.Blog.title}</h1>
<article>
	<h2>{data.Post.title}</h2>
	{data.Post.content}
</article>
