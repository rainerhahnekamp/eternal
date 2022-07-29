import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularComponent } from './angular.component';
import { bootstrapModule, mount, MountResponse, setupComponent, setupFixture, TestBedConfig } from './mount';
import { _expect as expect } from './expect'


describe('mount', () => {
  // it('returns a MountResponse', async () => {
  //   // arrange
    
  //   // act
  //   mount(AngularComponent, {}).then((response: MountResponse<AngularComponent>) => {
  //     // assert
  //     // expect(response).toBeTruthy()
  //     expect(response.component).toBeInstanceOf(AngularComponent);
  //     expect(response.fixture).toBeInstanceOf(ComponentFixture);
  //     expect(response.testBed).toBeInstanceOf(TestBed);
  //   })
  // })

  // it('adds inputs to componentInstance', () => {
  //   // arrange\
  //   const title = "My Test Title";

  //   // act
  //   const actual = mount(AngularComponent, { inputs: { title }});

  //   // assert
  //   actual.then((response: MountResponse<AngularComponent>) => {
  //     expect(response.component.title).toEqual(title);
  //   })
  // })

  describe('setupFixture', () => {
    const fixture = {
      whenStable() {
        return new Promise(() => this.autoDetectChanges())
      },
      autoDetectChanges(autoDetect: boolean) {
        return
      }
    } as ComponentFixture<AngularComponent>;

    const testBed = {
      createComponent(component: Type<AngularComponent>) {
        return fixture;
      }
    } as TestBed;
    it('returns the fixture', () => {
      // arrange
      // act
      const actual = setupFixture(AngularComponent, testBed, true);

      // assert
      expect(actual).toEqual(fixture);
    })

    it('gets the fixture from the testBed', () => {
      // arrange
      const testBedSpy = jest.spyOn(testBed, 'createComponent');

      // act
      setupFixture(AngularComponent, testBed, true);

      // assert
      expect(testBedSpy).toHaveBeenCalledTimes(1);
    })

    it('calls whenStable', () => {
      // arrange
      const whenStableSpy = jest.spyOn(fixture, 'whenStable');
      
      // act
      setupFixture(AngularComponent, testBed, true);

      // assert
      expect(whenStableSpy).toHaveBeenCalledTimes(1)
    })

    it('should call autoDetectChanges with autoDetectChanges flag', () => {
      // arrange
      const autoDetectSpy = jest.spyOn(fixture, 'autoDetectChanges');

      // act
      setupFixture(AngularComponent, testBed, false);

      // assert
      expect(autoDetectSpy).toHaveBeenCalledTimes(1);
      expect(autoDetectSpy).toHaveBeenCalledTimes(1);
    })
  })

  describe('setupComponent', () => {
    it('does just returns the componentInstance when no inputs passed in config', () => {
      // arrange
      const fixture = {
        componentInstance: new AngularComponent()
      } as ComponentFixture<AngularComponent>;
      const config: TestBedConfig<AngularComponent> = {};

      // act
      const actual = setupComponent(config, fixture);

      // assert
      expect(actual.title).toEqual('default');
    })
    it('adds config inputs to component', () => {
      // arrange
      const fixture = {
        componentInstance: new AngularComponent()
      } as ComponentFixture<AngularComponent>;
      const title = 'Test Title';
      const config: TestBedConfig<AngularComponent> = { inputs: { title }}

      // act
      const actual = setupComponent(config, fixture)

      // assert
      expect(actual.title).toEqual(title);
    })

  })
  describe('bootstrapModule', () => {
    it('removes the inputs from the config object', () => {
      // arrange
      const config: TestBedConfig<AngularComponent> = {
        inputs: { title: 'test' }
      }
      
      // act
      const actual = bootstrapModule(AngularComponent, config);

      // assert
      expect(actual.inputs).toBeUndefined();
    })

    it('adds the component to its declarations', () => {
      // arrange
      const config: TestBedConfig<AngularComponent> = {};

      // act
      const actual = bootstrapModule(AngularComponent, config);

      // assert
      expect(actual.declarations).toEqual([AngularComponent])
    })

    it('adds the CommonModule to its imports', () => {
      // arrange
      const config: TestBedConfig<AngularComponent> = {};

      // act
      const actual = bootstrapModule(AngularComponent, config);

      // assert
      expect(actual.imports).toEqual([CommonModule])
    })
  })
});
