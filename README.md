# nodejs-project

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px'}}}%%
flowchart LR
    A(["🧑‍💻 Developer"]) ==> B(["📤 Push"]) ==> C(["🐙 Github"])
    C ==> F(["🔧 Jenkins"])
    F ==> E(["🐳 Docker"]) ==> D(["🏗️ Docker Build"])
    D ==> G(["📦 Docker Image"]) ==> H(["🚀 Docker Run"])

    classDef pink fill:#e75480,stroke:#7a1f3d,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef orange fill:#ff9f1c,stroke:#a65700,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef green fill:#43aa8b,stroke:#1b4d1e,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef blue fill:#3a86ff,stroke:#173d5e,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef red fill:#ef476f,stroke:#8c1d3f,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef purple fill:#9d4edd,stroke:#4a1d6e,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px

    class A pink
    class B orange
    class C purple
    class F green
    class E blue
    class D red
    class G orange
    class H pink

    style A stroke-width:4px
    linkStyle 0 stroke:#e75480,stroke-width:5px
    linkStyle 1 stroke:#ff9f1c,stroke-width:5px
    linkStyle 2 stroke:#9d4edd,stroke-width:5px
    linkStyle 3 stroke:#43aa8b,stroke-width:5px
    linkStyle 4 stroke:#3a86ff,stroke-width:5px
    linkStyle 5 stroke:#ef476f,stroke-width:5px
```
