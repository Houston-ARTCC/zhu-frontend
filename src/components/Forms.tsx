'use client';

import React, { type HTMLProps } from 'react';
import classNames from 'classnames';
import { BsUpload } from 'react-icons/bs';
import Dropzone, { type DropEvent } from 'react-dropzone';
import Select, { type GroupBase, type Props as SelectProps, type SelectInstance } from 'react-select';

interface InputProps<T> extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
    label?: string;
    inputClassName?: string;
    error?: string;
    onUpdate?: (value: T) => void;
}

export const TextInput: React.FC<InputProps<string>> = React.forwardRef<HTMLInputElement, InputProps<string>>(
    (
        { label, inputClassName, error, onUpdate, className, ...props },
        ref,
    ) => (
        <div className={classNames('flex flex-col', className)}>
            {label && (
                <label
                    className="mb-2 max-w-fit font-medium"
                    htmlFor={props.name}
                >
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={props.name}
                className={classNames(
                    'block rounded-md px-3 py-1.5 transition-all duration-200',
                    'border-2 border-slate-200 outline-0 ring-0 ring-sky-400/25 focus:border-sky-400 focus:ring-2',
                    'read-only:bg-neutral-100 read-only:!border-slate-200 read-only:!text-gray-500 read-only:!ring-0',
                    'dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder:text-zinc-500',
                    'dark:read-only:bg-zinc-800 dark:read-only:!border-zinc-700 dark:read-only:!text-zinc-400',
                    { '!ring-red-400/25 !border-red-400': error },
                    inputClassName,
                )}
                onChange={(e) => {
                    onUpdate?.(e.target.value);
                    props.onChange?.(e);
                }}
                {...props}
            />
            {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
        </div>
    ),
);
// React.forwardRef does not preserve this information, so we have to set it manually for debugging.
TextInput.displayName = 'TextInput';

interface TextAreaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'ref'> {
    label?: string;
    inputClassName?: string;
    error?: string;
    onUpdate?: (value: string) => void;
}

export const TextAreaInput: React.FC<TextAreaProps> = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        { label, inputClassName, error, onUpdate, className, ...props },
        ref,
    ) => (
        <div className={classNames('flex flex-col', className)}>
            {label && (
                <label
                    className="mb-2 max-w-fit font-medium"
                    htmlFor={props.name}
                >
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={props.name}
                className={classNames(
                    'block rounded-md px-3 py-1.5 transition duration-200',
                    'border-2 border-slate-200 outline-0 ring-0 ring-sky-400/25 focus:border-sky-400 focus:ring-2',
                    'read-only:bg-neutral-50 read-only:!border-slate-200 read-only:!text-gray-500 read-only:!ring-0',
                    'dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder:text-zinc-500',
                    'dark:read-only:bg-zinc-800 dark:read-only:!border-zinc-700 dark:read-only:!text-zinc-400',
                    { '!ring-red-400/25 !border-red-400': error },
                    inputClassName,
                )}
                onChange={(e) => {
                    onUpdate?.(e.target.value);
                    props.onChange?.(e);
                }}
                {...props}
            />
            {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
        </div>
    ),
);
// React.forwardRef does not preserve this information, so we have to set it manually for debugging.
TextAreaInput.displayName = 'TextAreaInput';

export const ToggleInput: React.FC<Omit<InputProps<boolean>, 'inputClassName'>> = React.forwardRef<HTMLInputElement, InputProps<boolean>>(
    (
        { label, error, onUpdate, className, ...props },
        ref,
    ) => (
        <div className={classNames('flex flex-col', className)}>
            <div className="flex items-center gap-3">
                <div className="relative h-5">
                    <input
                        ref={ref}
                        id={props.name}
                        className="peer h-5 w-9 cursor-pointer opacity-0"
                        onChange={(e) => {
                            onUpdate?.(e.target.checked);
                            props.onChange?.(e);
                        }}
                        type="checkbox"
                        {...props}
                    />
                    <div
                        className={classNames(
                            'absolute left-0 top-0 -z-10 h-5 w-9 rounded-full bg-slate-300/25',
                            'peer-checked:bg-sky-400/25 transition-colors duration-100',
                        )}
                    />
                    <div
                        className={classNames(
                            'absolute left-1 top-1 -z-10 h-3 w-3 rounded-full bg-slate-300',
                            'peer-checked:left-5 peer-checked:bg-sky-400 transition-all duration-100',
                        )}
                    />
                </div>
                {label && (
                    <label
                        className="font-medium"
                        htmlFor={props.name}
                    >
                        {label}
                    </label>
                )}
            </div>
            {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
        </div>
    ),
);
// React.forwardRef does not preserve this information, so we have to set it manually for debugging.
ToggleInput.displayName = 'ToggleInput';

export type SelectOption<T = number> = {
    value: T;
    label: string;
    isFixed?: boolean;
    isDisabled?: boolean;
}

// The crazy generic types are necessary to preserve the Option type throughout all of react-select's props.
// More information is available at https://react-select.com/typescript
interface SelectInputProps<
    Value,
    IsMulti extends boolean = false,
    Group extends GroupBase<SelectOption<Value>> = GroupBase<SelectOption<Value>>,
> extends Partial<SelectProps<SelectOption<Value>, IsMulti, Group>> {
    label: string;
    error?: string;
    ref?: React.Ref<SelectInstance<SelectOption<Value>, IsMulti, Group>>
}

export const SelectInput = (
    <
        Value,
        IsMulti extends boolean = false,
        Group extends GroupBase<SelectOption<Value>> = GroupBase<SelectOption<Value>>
    >(
        { label, error, className, ref, ...props }: SelectInputProps<Value, IsMulti, Group>,
    ) => (
        <div className={classNames('flex flex-col', className)}>
            <label
                className="mb-2 max-w-fit font-medium"
                htmlFor={props.name}
            >
                {label}
            </label>
            <Select
                id={props.name}
                ref={ref}
                menuPortalTarget={document.body}
                classNames={{
                    menuPortal: () => '!z-50',
                    control: ({ isFocused }) => classNames(
                        '!transition-all !duration-200 !border-2 dark:!bg-zinc-900',
                        {
                            '!ring-0': !isFocused,
                            '!ring-2': isFocused,
                            '!border-slate-200 dark:!border-zinc-700': !isFocused && !error,
                            '!ring-sky-400/25 !border-sky-400': isFocused && !error,
                            '!ring-red-400/25 !border-red-400': error,
                        },
                    ),
                    input: () => '!text-inherit',
                    singleValue: () => '!text-inherit',
                    multiValue: () => '!text-inherit',
                    multiValueRemove: ({ data: { isFixed } }) => (isFixed ? '!hidden' : ''),
                    multiValueLabel: ({ data: { isFixed } }) => (isFixed ? '!px-2' : '!pl-2 !pr-1'),
                    groupHeading: () => '-mt-2 !mb-0 py-2 sticky top-0 bg-white rounded-t-md font-bold dark:!bg-zinc-800',
                    menuList: () => '!shadow !py-0 dark:!bg-zinc-800 dark:!shadow-stone-900',
                    indicatorSeparator: () => 'dark:!bg-zinc-700/80',
                    option: ({ isFocused, isSelected }) => classNames({
                        '!bg-sky-500/10': isFocused && !isSelected,
                        '!bg-sky-500 dark:!bg-sky-500/50': isSelected,
                    }),
                }}
                {...props}
            />
            {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
        </div>
    )
);

interface FileInputProps extends InputProps<string> {
    currentFile?: File | string;
    onUpload: (acceptedFiles: File[], event: DropEvent) => void
}

export const FileInput: React.FC<FileInputProps> = ({ error, currentFile, onUpload, className, ...props }) => (
    <Dropzone onDropAccepted={onUpload} maxFiles={1}>
        {({ getRootProps, getInputProps }) => (
            <div className={className}>
                <div
                    className={classNames(
                        'flex flex-col items-center justify-center rounded-md px-5 py-10',
                        'cursor-pointer text-center text-slate-300 transition-all duration-200',
                        'border-2 border-dashed border-slate-200 outline-0 ring-0 ring-sky-400/25 focus:border-sky-400 focus:ring-2',
                        'dark:border-zinc-700 dark:text-zinc-600',
                        { '!ring-red-400/25 !border-red-400 !text-red-400': error },
                    )}
                    {...getRootProps()}
                >
                    <input {...props} {...getInputProps()} />
                    <BsUpload className="mb-2" size={35} />
                    <p className="font-medium">Drag and drop files here, or click to select files</p>
                    {currentFile && (
                        <p className="mt-3 max-w-full truncate text-slate-700 dark:text-zinc-400">
                            Current File: {currentFile instanceof File
                                ? currentFile.name
                                : currentFile.split('/').pop()}
                        </p>
                    )}
                </div>
                {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
            </div>
        )}
    </Dropzone>
);
