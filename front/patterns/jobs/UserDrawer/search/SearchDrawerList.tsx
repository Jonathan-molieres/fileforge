import React, { useState } from 'react'
import {
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    ListItemButton,
    Box,
} from '@mui/material'
import { _ } from '@/utils/i18n'
import CandidateSearch from '@/models/jobs/CandidateSearch'
import CandidateSearchSaved from '@/models/jobs/CandidateSearchSaved'
import SaveSearchDialog from './SaveSearchDialog'
interface SearchDrawerMenuProps {
    search: CandidateSearch
}
import { observer } from 'mobx-react'
import IconeDrawer from '../IconeDrawer'

export default observer(function SearchDrawerList({ search }: SearchDrawerMenuProps) {
    const searchSaved = search.searchSaved
    const [isSaveDialogOpen, setSaveDialogOpen] = useState(false)

    const openSaveDialog = () => {
        setSaveDialogOpen(true)
    }

    const closeSaveDialog = () => {
        setSaveDialogOpen(false)
    }

    const handleSaveSearchWithCustomName = (saveName) => {
        console.log(`Recherche sauvegardée avec le nom : ${saveName}`)
        closeSaveDialog()
    }

    const handleLoadSavedSearch = (searchSaved: CandidateSearchSaved) => {
        // Implémentez la logique pour charger la recherche sauvegardée ici
    }

    const onHandleSaveSearch = () => {
        openSaveDialog()
    }
    const handleDeleteSavedSearch = (searchSaved: CandidateSearchSaved) => {
        searchSaved.deleteSearchSaved()
        search.getSearchSaved()
    }

    return (
        <>
            <Box sx={{}}>
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: 'center',
                        marginTop: '16px',
                    }}
                >
                    {_('Recherche')}
                </Typography>
                <Divider />
                <List
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <ListItem onClick={onHandleSaveSearch}>
                        <Button>
                            <ListItemText primary={_('Sauvegarder la recherche')} />
                        </Button>
                    </ListItem>
                    <Divider />
                    {searchSaved && searchSaved.length > 0 ? (
                        <>
                            <ListItemButton disabled={true}>
                                <ListItemText primary={_('Vos recherches sauvegardées')} />
                            </ListItemButton>
                            <Divider />
                        </>
                    ) : (
                        <ListItemButton disabled={true}>
                            <ListItemText primary={_('Aucune recherche sauvegardée')} />
                        </ListItemButton>
                    )}
                    {searchSaved?.map((searchSaved) => (
                        <ListItem key={searchSaved.id}>
                            <ListItemButton>
                                <ListItemText
                                    primary={searchSaved.name}
                                    onClick={() => handleLoadSavedSearch(searchSaved)}
                                />
                            </ListItemButton>
                            <ListItemIcon>
                                <IconeDrawer
                                    handleCheckClick={() => handleLoadSavedSearch(searchSaved)}
                                    handleClearClick={() => handleDeleteSavedSearch(searchSaved)}
                                />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                    <SaveSearchDialog
                        open={isSaveDialogOpen}
                        onClose={closeSaveDialog}
                        onSave={handleSaveSearchWithCustomName}
                    />
                </List>
            </Box>
        </>
    )
})
