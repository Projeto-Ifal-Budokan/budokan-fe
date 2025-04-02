import "./HeaderStyle.css";

export default function Header () {
    return (
        <div id="header-div">
            
            <img src="/logo.jpg" alt="Budokan-Ryu Logo"/>
            <h1>Budokan-Ryu</h1>
            
            <ul>
                <li><a>Sobre Nós</a></li>
                <li><a>Modalidades</a></li>
                <li><a>Senseis</a></li>
                <li><a>Horários</a></li>
                <li><a>Contato</a></li>
                <li><button>Área do Aluno</button></li>
            </ul>
        </div>
    );
}