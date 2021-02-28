<script>
    import {tooltip} from "./stores/tooltip-store";
</script>

<div class="tooltip"
     style="
        top: {$tooltip?.top}px;
        left: {$tooltip?.left}px;
        visibility:{$tooltip == null ? 'hidden' : 'visible'}">
    <h3>{$tooltip?.title}</h3>
    <div>{$tooltip?.body}</div>
</div>

<style>

    h3 {
        margin-top: 0;
    }
    .tooltip {
        background: rgba(234, 237, 243, 0.9);
        border: 1px solid #ccc;
        border-radius: .1rem;
        color: #444;
        font-size: 14px;
        max-width: 320px;
        padding: 0.3rem 0.4rem;
        position: absolute;
        z-index: 300;
    }
</style>