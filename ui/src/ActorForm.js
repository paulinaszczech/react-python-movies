import {useState} from "react";

export default function ActorForm(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    async function addActor(event) {
        event.preventDefault();
        if (name.length < 1) {
            return alert('Imię jest za krótkie');
        }
        if (surname.length < 1) {
            return alert('Nazwisko jest za krótkie');
        }
        try {
            const response = await fetch('/actors', {
                method: 'POST',
                body: JSON.stringify({name, surname}),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const actor = await response.json();
                props.onActorSubmit(actor);
                setName('');
                setSurname('');
            } else {
                alert('Błąd podczas dodawania aktora');
            }
        } catch (error) {
            alert('Błąd sieci: ' + error.message);
        }
    }

    return (
        <form onSubmit={addActor}>
            <h2>Add Actors</h2>
            <div>
                <label>Name</label>
                <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>
            </div>
            <div>
                <label>Surname</label>
                <input type="text" value={surname} onChange={(event) => setSurname(event.target.value)}/>
            </div>
            <button className="button" type="submit">Add Actor</button>
        </form>
    );
}
