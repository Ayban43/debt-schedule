import React, { useState, useEffect } from 'react';
import { MultiSelect } from "react-multi-select-component";
import supabase from "../config/supabaseClient";

const SelectDebt = ({selected = [], setSelected}) => {
    const [options, setOptions] = useState([]);

    const handleChange = async (selected) => {
        //console.log(selected)
        setSelected(selected);
        var selectedId = selected.map(item => item.value)
        //console.log(selectedId)
        try {
            const res = await supabase
            .from('debts')
            .select('*')
            .in( 'id', selectedId )
            
            console.log(res.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await supabase.from('debts').select('*')
                setOptions(res.data.map(item => {
                    return {
                        label: item.description,
                        value: item.id
                    }
                }));
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);
    
    

    return (
        <>

            <MultiSelect
                options={options}
                value={selected}
                onChange={handleChange}
                labelledBy="Select"
            />
        </>
    );
};

export default SelectDebt;