<script>
  let { size = 24, color = "currentColor", ...rest } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
     viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" 
     stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus" {...rest}
><path d="M6 13h15"/><path d="M13 6v15"/></svg>