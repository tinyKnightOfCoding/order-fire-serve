
export interface MenuItemDto {
    readonly id: string
    readonly name: string
    readonly price: number
}

export interface MenuItemCreateDto {
    readonly name: string
    readonly price: number
}

export interface MenuItemPatchDto {
    readonly name?: string;
    readonly price?: number;
}

export interface TransactionDto {
    readonly id: string
    readonly previousId: string
    readonly commands: CommandDto[]
}

export type CommandType = 'MENU_ITEM_CREATE' | 'MENU_ITEM_PATCH' | 'MENU_ITEM_DELETE'

export interface CommandDto {
    readonly id: string;
    readonly targetId: string
    readonly commandType: CommandType
}

export interface MenuItemCreateCommandDto extends CommandDto {
    readonly commandType: 'MENU_ITEM_CREATE'
    readonly name: string
    readonly price: number
}

export interface MenuItemPatchCommandDto extends CommandDto {
    readonly commandType: 'MENU_ITEM_PATCH'
    readonly name?: string
    readonly price?: number
}

export interface MenuItemDeleteCommandDto extends CommandDto {
    readonly commandType: 'MENU_ITEM_DELETE'
}

export function getAllMenuItems(): Promise<MenuItemDto[]> {
    return fetch('/api/menu-items').then(res => res.json())
}

export function putMenuItem(body: MenuItemCreateDto, menuItemId: string, commandId: string): Promise<MenuItemDto> {
    return fetch(`/api/menu-items/${menuItemId}`, {
        method: 'PUT',
        headers: {
            'OFS-Command-ID': commandId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}

export function patchMenuItem(body: MenuItemPatchDto, menuItemId: string, commandId: string): Promise<MenuItemDto> {
    return fetch(`/api/menu-items/${menuItemId}`, {
        method: 'PATCH',
        headers: {
            'OFS-Command-ID': commandId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(res => {
        if(res.status >= 400) return Promise.reject("Failed")
        return res
    })
        .then(res => {
        console.log(res)
        return res.json()
    })
}

export function deleteMenuItem(menuItemId: string, commandId: string): Promise<MenuItemDto> {
    return fetch(`/api/menu-items/${menuItemId}`, {
        method: 'DELETE',
        headers: {
            'OFS-Command-ID': commandId,
            'Content-Type': 'application/json',
        },
    }).then(res => res.json())
}

export function seekTransactions(lastKnownId?: string | null, size?: number): Promise<TransactionDto[]> {
    const params = new URLSearchParams(cleanParams({lastKnownId, size}))
    return fetch('/api/transactions?' + params).then(res => res.json())
}

export function cleanParams(record: Record<string, string | number | undefined | null>): [string, string][] {
    return Object.entries(record)
        .filter(isEntryValueDefined)
        .map(entry => [entry[0], `${entry[1]}`])
}

function isEntryValueDefined<T>(value: [string, T | undefined | null]): value is [string, T] {
    return value[1] !== undefined && value[1] !== null;
}
