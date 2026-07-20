# nodejs-project

```mermaid
flowchart LR
    subgraph Pipeline[" "]
        direction LR
        A(["Developer"]) ==> B(["Push"]) ==> C(["Github"])
        C ==> F(["Jenkins"])
        F ==> E(["Docker"]) ==> D(["Docker Build"])
        D ==> G(["Docker Image"]) ==> H(["Docker Run"])
    end

    classDef developer fill:#a4508b,stroke:#5c1a4a,stroke-width:3px,color:#fff,font-weight:bold
    classDef push fill:#c9770c,stroke:#7a4700,stroke-width:3px,color:#fff,font-weight:bold
    classDef github fill:#a4508b,stroke:#5c1a4a,stroke-width:3px,color:#fff,font-weight:bold
    classDef jenkins fill:#2e7d32,stroke:#1b4d1e,stroke-width:3px,color:#fff,font-weight:bold
    classDef docker fill:#c9770c,stroke:#7a4700,stroke-width:3px,color:#fff,font-weight:bold
    classDef dockerbuild fill:#2f6fa8,stroke:#173d5e,stroke-width:3px,color:#fff,font-weight:bold
    classDef dockerimage
