import { useState } from "react";
import * as XLSX from "xlsx";


const FileUploader = ({onDataLoaded})=> {
    const [file, setFile]= useState(null)

    const handleChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)

        const reader = new FileReader();
        reader.onload= (event) => {
            const data= event.target.result
       

            const workbook = XLSX.read(data, {
                type: "binary"
            })

            const sheetName= workbook.SheetNames[0]

            const worksheet= workbook.Sheets[sheetName]

            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            console.log(jsonData)

            onDataLoaded(jsonData)
        }
        reader.readAsBinaryString(selectedFile);
    }

    return (
        <div>
            <h3>Importer fichier excel</h3>
            <input type="file" accept=".xlsx,.xls" onChange={handleChange} />

            {file && (
                <p>{file.name}</p>
            )}
        </div>
    )
}

export default FileUploader