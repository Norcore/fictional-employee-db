import { useEffect, useState } from "react"

const Superheroes = () => {

    const [superheroes, setSuperheroes] = useState([]);

    useEffect(() => {
        fetch(`http://process.env.BACKEND_URL/employees/superheroes`)
            .then(res => res.json())
            .then(data => {
                setSuperheroes(data);
                console.log(data);
            })
            .catch(err => console.log("Error", err))
    }, [])


    function renderSuperHeroes() {

        return (
            <div className="EmployeeTable">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Position</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {superheroes.map((employee) => (
                            <tr key={employee._id}>
                                <td>{employee.name}</td>
                                <td>{employee.level}</td>
                                <td>{employee.position}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )

    }

    return <>{renderSuperHeroes()}</>

}

export default Superheroes;