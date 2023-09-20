'use client';

import React, { type HTMLProps } from 'react';
import classNames from 'classnames';
import { BsUpload } from 'react-icons/bs';
import Dropzone, { type DropEvent } from 'react-dropzone';
import Select, { type GroupBase, type Props as SelectProps } from 'react-select';

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
    label?: string;
    inputClassName?: string;
    error?: string;
    onUpdate?: (value: string | boolean | number) => void;
}

export const TextInput: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
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

export const ToggleInput: React.FC<Omit<InputProps, 'inputClassName'>> = React.forwardRef<HTMLInputElement, InputProps>(
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
                        className="peer h-5 w-9 opacity-0"
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
                            'peer-checked:bg-sky-400/25 transition-colors duration-100 ',
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

// The crazy generic types are necessary to preserve the Option type throughout all of react-select's props.
// More information is available at https://react-select.com/typescript
interface SelectInputProps<
    Value,
    Option extends { value: Value, label: string, isFixed?: boolean, isDisabled?: boolean },
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
> extends Partial<SelectProps<Option, IsMulti, Group>> {
    label: string;
    error?: string;
}

// For some reason, using generics with an arrow function breaks eslint's indent rule, so we'll just use a regular function.
/* eslint-disable-next-line react/function-component-definition */
export function SelectInput<
    Value,
    Option extends { value: Value, label: string, isFixed?: boolean, isDisabled?: boolean },
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    { label, error, className, ...props }: SelectInputProps<Value, Option, IsMulti, Group>,
) {
    return (
        <div className={classNames('flex flex-col', className)}>
            <label
                className="mb-2 max-w-fit font-medium"
                htmlFor={props.name}
            >
                {label}
            </label>
            <Select
                id={props.name}
                classNames={{
                    control: ({ isFocused }) => classNames(
                        '!transition-all !duration-200 !border-2',
                        {
                            '!ring-0': !isFocused,
                            '!ring-2': isFocused,
                            '!border-slate-200': !isFocused && !error,
                            '!ring-sky-400/25 !border-sky-400': isFocused && !error,
                            '!ring-red-400/25 !border-red-400': error,
                        },
                    ),
                    multiValueRemove: ({ data: { isFixed } }) => (isFixed ? '!hidden' : ''),
                    multiValueLabel: ({ data: { isFixed } }) => (isFixed ? '!px-2' : '!pl-2 !pr-1'),
                    groupHeading: () => '-mt-2 !mb-0 py-2 sticky top-0 bg-white rounded-t-md font-bold',
                    menuList: () => '!py-0',
                }}
                {...props}
            />
            {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
        </div>
    );
}

interface FileInputProps extends InputProps {
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
                        'cursor-pointer text-center text-slate-400 transition-all duration-200',
                        'border-2 border-dashed border-slate-200 outline-0 ring-0 ring-sky-400/25 focus:border-sky-400 focus:ring-2',
                        { '!ring-red-400/25 !border-red-400 !text-red-400': error },
                    )}
                    {...getRootProps()}
                >
                    <input {...props} {...getInputProps()} />
                    <BsUpload className="mb-2" size={35} />
                    <p className="font-medium">Drag and drop files here, or click to select files</p>
                    {currentFile && (
                        <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
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
