<script>
  let { size = 24, color = "currentColor", ...rest } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} 
     viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" 
     stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gauge-icon lucide-gauge" {...rest}
><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>