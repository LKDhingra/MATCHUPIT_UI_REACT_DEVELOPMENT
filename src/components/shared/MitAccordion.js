import React from 'react';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

export default function MitAccordion(props) {
    return (
        <Accordion allowZeroExpanded className="mit-accordion">
            {props.blocks.map(i =>
                <AccordionItem key={`acc_${i.key}`}>
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            {props.type === 'education' && (i.props.degree === "" ? "Click Here to add details" : `${i.props.degree} @ ${i.props.institute}`)}
                            {props.type === 'certification' && (i.props.certiName === "" ? "Click Here to add details" : `${i.props.certiName}`)}
                            {props.type === 'work' && (i.props.orgNames === "" ? "Click Here to add details" : `${i.props.designations} @ ${i.props.orgNames}`)}
                            {props.type === 'auth' && (i.props.countryName === "" ? "Click Here to add details" : `Can work in ${i.props.countryName} till ${i.props.expiry}`)}
                            {props.type === 'address' && (i.props.countryO === "" ? "Click Here to add details" : `${i.props.countryO}, ${i.props.stateO}, ${i.props.cityO}`)}
                            {props.type === 'board' && (i.props.boardName === "" ? "Click Here to add details" : `${i.props.boardName} (${i.props.boardType})`)}
                            <span className="fa fa-pencil-square-o"></span>
                            <span className="fa fa-trash-o" onClick={i.props.ifDeleted}></span>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        {i}
                    </AccordionItemPanel>
                </AccordionItem>
            )}
        </Accordion>
    );
}