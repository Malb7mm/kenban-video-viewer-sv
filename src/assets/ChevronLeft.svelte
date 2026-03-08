<script>
  let { size = 24, color = "currentColor", ...rest } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} 
     viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" 
     stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left" {...rest}
><path d="m15 18-6-6 6-6"/></svg>