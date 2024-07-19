import axios from 'axios';
import { readExcelFile } from './master-util'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

//interfaces
interface UploadFunctions {
    [key: string]: (file: File) => Promise<any>;
}
interface Material {
    Material_Number: string;
    Material: string;
    Mapping_Report: string;
    Division: string;
}
interface Customer {
    Customer: string;
    Customer_Name: string;
    Company_Code: string;
    AM: string;
}

//handle per master module
export const handleCustomerUpload = async (file: File): Promise<Customer[]> => {
    const columnMappings = {
        Customer: 2,
        Customer_Name: 3,
        Company_Code: 1,
        AM: 4,
    };

    const rows = await readExcelFile(file, columnMappings);
    const customers: Customer[] = rows.map(row => ({
        Customer: row.Customer,
        Customer_Name: row.Customer_Name,
        Company_Code: row.Company_Code,
        AM: row.AM,
    }));

    return customers;
};

export const handleMaterialUpload = async (file: File): Promise<Material[]> => {
    const columnMappings = {
        Material: 1,
        Material_Number: 2,
        Mapping_Report: 3,
        Division: 4,
    };

    const rows = await readExcelFile(file, columnMappings);
    const materials: Material[] = rows.map(row => ({
        Material: row.Material,
        Material_Number: row.Material_Number,
        Mapping_Report: row.Mapping_Report,
        Division: row.Division,
    }));

    return materials;
};


//main function
const uploadFunctions: UploadFunctions = {
    Material: handleMaterialUpload,
    Customer: handleCustomerUpload,
};
export const uploadFile = async (key: string, file: File) => {
    if (!(key in uploadFunctions)) {
        throw new Error(`Unsupported key: ${key}`);
    }

    try {
        const formData = await uploadFunctions[key](file);

        const response = await axios.post(`${BASE_URL}/${key}data`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`HTTP error! status: ${error.response?.status}`);
        } else {
            throw new Error('Network error occurred.');
        }
    }
};
