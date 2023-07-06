import React, { type HTMLProps } from 'react';
import classNames from 'classnames';
import { BsUpload } from 'react-icons/bs';
import Dropzone, { type DropEvent } from 'react-dropzone';
import Select, { type GroupBase, type Props as SelectProps } from 'react-select';

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
    label?: string;
    inputClassName?: string;
    error?: string;
    onUpdate?: (value: string) => void;
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
                    'read-only:bg-slate-50 read-only:!border-slate-200 read-only:!ring-0',
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

// The crazy generic types are necessary to preserve the Option type throughout all of react-select's props.
// More information is available at https://react-select.com/typescript
interface SelectInputProps<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
> extends Partial<SelectProps<Option, IsMulti, Group>> {
    label: string;
    error?: string;
}

// For some reason, using generics with an arrow function breaks eslint's indent rule, so we'll just use a regular function.
/* eslint-disable-next-line react/function-component-definition */
export function SelectInput<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
    { label, error, className, ...props }: SelectInputProps<Option, IsMulti, Group>,
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
