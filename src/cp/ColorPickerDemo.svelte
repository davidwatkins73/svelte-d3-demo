<script>
    import ColorPicker from "./ColorPicker.svelte";

    let predefinedColors = [
        "#cac8c8",
        "#f6acac",
        "#aefcb4",
        "#f8cc67",
        "#bcbcef"
    ];

    let selected1 = "#cd34de";
    let selected2 = "#34dcce";
    let selected3 = "#dcce33";
</script>


<div style="display: inline-block; width: 30%" >
    <h3 style="background-color: {selected1}">
        {selected1}
    </h3>
    <ColorPicker on:select={(e) => selected1 = e.detail}
                 startColor={selected1}
                 {predefinedColors}/>
</div>

<div style="display: inline-block; width: 30%">
    <h3 style="background-color: {selected2}">
        {selected2}
    </h3>
    <ColorPicker on:select={(e) => selected2 = e.detail}
                 startColor={selected2}
                 {predefinedColors}/>
</div>

<div style="display: inline-block; width: 30%">
    <h3 style="background-color: {selected3}">
        {selected3}
    </h3>
    <ColorPicker on:select={(e) => selected3 = e.detail}
                 startColor={selected3}
                 {predefinedColors}/>
</div>
