<script lang="ts">
	import Owned from './owner.svelte';
	import Authored from './author.svelte';
	import Reviewer from './reviewer.svelte';
	import { getContext } from 'svelte';

	const ownedBlogs = getContext('owned');
	const authoredBlogs = getContext('authored');
	const reviewedBlogs = getContext('reviewer');
</script>

<Owned {ownedBlogs} />
<Reviewer {reviewedBlogs} />
<Authored {authoredBlogs} />
