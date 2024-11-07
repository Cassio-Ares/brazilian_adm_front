import './inputAdm.css'

export const InputAdm = ({ labelText, value, placeholder, error, type, onChange, name}) => {
    const handleChange = (e) =>{
        onChange(e); 
    }

    return (
        <div className='containerInput'>
            <label className="label" htmlFor={name}>{labelText}</label>
            <input
             className="inputAdm"
             type={type || "text"}
             placeholder={placeholder}
             value={value}
             name={name}
             onChange={handleChange}
             error={error}
            />
            {error && <div className="classError">{error}</div>}
        </div>
    )
};


//onrender