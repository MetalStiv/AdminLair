import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom'
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/js/dist/dropdown'
import MainPage from './mainPage'
import ArticlePage from './articlePage'
import Header from './header'
import ConstructorPage from './constructorPage'

const App = () => {
    const [categoryFilter, setCategoryFilter] = useState(0);
    const [searchFilter, setSearchFilter] = useState('');

    return (
        <BrowserRouter>
            <Header setCategoryFilter={setCategoryFilter} setSearchFilter={setSearchFilter} />

            <Switch>
                <Route exact path="/" 
                    render={() => <MainPage categoryFilter={categoryFilter} searchFilter={searchFilter} />} />
                <Route path="/article/:id" 
                    render={() => <ArticlePage />} />
                <Route path="/constructor" 
                    render={() => <ConstructorPage mode={0} />} />
                <Route path="/updateArticle/:id"
                    render={() => <ConstructorPage mode={1} />} />
            </Switch>
        </BrowserRouter>
    )
}

export default App
  