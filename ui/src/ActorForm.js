import {useState} from "react";

export default function ActorForm({ onActorSubmit }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        if (name.length < 1) {
            return alert('Name is too short');
        }
        if (surname.length < 1) {
            return alert('Surname is too short');
        }
        onActorSubmit({name, surname});
        setName('');
        setSurname('');
    }

    return (
        <form onSubmit={handleSubmit}>
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
