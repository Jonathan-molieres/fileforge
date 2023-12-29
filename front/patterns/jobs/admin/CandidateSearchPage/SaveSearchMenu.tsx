import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Tooltip,
    Button,
    Menu as MuiMenu,
    MenuItem,
    
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { _ } from '@/utils/i18n'
import MenuIcon from '@mui/icons-material/Menu';
import CandidateSearchSaved from '@/models/jobs/CandidateSearchSaved';
interface MenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
    onHandleSaveSearch: () => void;
    searchSaved: CandidateSearchSaved[] | undefined; 
    onHandleLoadSavedSearch: (searchSaved: CandidateSearchSaved) => void;
}

export default function Menu({
    anchorEl,
    open,
    onClose,
    onOpenMenu,
    onHandleSaveSearch,
    searchSaved,
    onHandleLoadSavedSearch,
}: MenuProps) {
    return (
        <Box>
            <Button onClick={onOpenMenu}>
                <MenuIcon />
            </Button>
            <MuiMenu
                anchorEl={anchorEl}
                open={open}
                onClose={onClose}
            >
                <Button><MenuItem onClick={onHandleSaveSearch}>
                    {_("Sauvegarder la recherche")}
                </MenuItem></Button>

                {searchSaved?.length > 0 && (
                    <><MenuItem divider disabled></MenuItem>
                    <MenuItem disabled >{_("Vos recherche sauvegardées")}</MenuItem>
                    <MenuItem divider disabled></MenuItem></>
                )}

                {searchSaved?.map(searchSaved => (
                    <MenuItem key={searchSaved.id} onClick={()=> onHandleLoadSavedSearch(searchSaved)}>

                        {searchSaved.name}
                        <ClearIcon sx={{ marginLeft: 'auto' }} onClick={()=>searchSaved.deleteSearchSaved()} />
                    </MenuItem>
                ))}
            </MuiMenu>
        </Box>
    );
}
