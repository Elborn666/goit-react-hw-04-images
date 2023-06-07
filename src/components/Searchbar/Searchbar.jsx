import PropTypes from 'prop-types';
import css from './Searchbar.module.css'
import { useState } from 'react';

function Searchbar( {onSubmit}) {

    const [searchQuery, setSearchQuery] = useState('')

    const handleChange = event => {
        setSearchQuery(event.target.value )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) {
            return
        }
        onSubmit(searchQuery);
    }

    return (
        <header className={css.Searchbar}>
            <form className={css.SearchForm} onSubmit={handleSubmit}>
                <button type="submit" className={css.SearchForm_button}>
                    <span className={css.SearchForm_button_label}>Search</span>
                </button>

                <input
                    className={css.SearchForm_input}
                    onChange={handleChange}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    value={searchQuery}
                />
            </form>
        </header>
    )
}

export default Searchbar

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};