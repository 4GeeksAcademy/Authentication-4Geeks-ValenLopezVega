import { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link, useNavigate, Navigate } from "react-router-dom"

const initialStateUser = {
    email: "",
    password: ""
}

export function Login() {

    const [user, setUser] = useState(initialStateUser)
    const { dispatch, store } = useGlobalReducer()
    const navigate = useNavigate()

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!user.email || !user.password) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const url = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        const data = await response.json()

        if (response.ok) {
            localStorage.setItem("token", data.token)
            dispatch({ type: "LOGIN", payload: data.token })
            setTimeout(() => {
                navigate("/")
            }, 2000)

        } else if (response.status === 400) {
            alert("Credenciales incorrectas")

        } else {

            alert("Error al iniciar sesión")
        }

    }

    if (store.token) {
        return <Navigate to="/" />
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3">Iniciar sesión</h2>
                <div className="col-12 col-md-6" >
                    <form
                        className="border m-2 p-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group mb-3">
                            <label htmlFor="btnEmail">Correo electronico</label>
                            <input
                                type="text"
                                placeholder="eldeimian@email.com"
                                className="form-control"
                                id="btnEmail"
                                name="email"
                                onChange={handleChange}
                                value={user.email}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="btnPass">Contraseña</label>
                            <input
                                type="password"
                                placeholder="password"
                                className="form-control"
                                id="btnPass"
                                name="password"
                                onChange={handleChange}
                                value={user.password}
                            />
                        </div>
                        <button
                            className="btn btn-outline-primary w-100"
                        >Ingresar</button>
                    </form>
                </div>

                <div className="w-100"></div>

                <div className="col-12 col-md-6  d-flex justify-content-between my-1 px-4 ">
                    <Link to="/register">Registrarme</Link>
                    <Link to="/recovery-password">Olvidé mi Contraseña</Link>
                </div>
            </div>
        </div>
    )
}